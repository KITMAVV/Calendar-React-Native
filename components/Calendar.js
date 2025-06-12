import React, { useState, useMemo, useContext, createContext } from "react";
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

const resources = {
    en: {
        translation: {
            calendar: {
                monthNames: [
                    "January","February","March","April","May","June","July","August","September","October","November","December"
                ],
                weekdaysShort: ["Mo","Tu","We","Th","Fr","Sa","Su"],
                today: "Today"
            }
        }
    },
    uk: {
        translation: {
            calendar: {
                monthNames: [
                    "Січень","Лютий","Березень","Квітень","Травень","Червень","Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"
                ],
                weekdaysShort: ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"],
                today: "Сьогодні"
            }
        }
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
});

const ThemeContext = createContext();

const themes = {
    light: {
        bg: "#ffffff",
        headerBg: "#ffffff",
        headerText: "#000",
        textPrimary: "#000",
        textSecondary: "#666",
        accent: "#ff7f00",
        todayAccent: '#ffeede',
        todayAccentBorder: '#ea6c00'
    },
    dark: {
        bg: "#1e1e1e",
        headerBg: "#1e1e1e",
        headerText: "#fff",
        textPrimary: "#fff",
        textSecondary: "#666",
        accent: "#ff7f00",
        todayAccent: '#373330',
        todayAccentBorder: '#ea6c00'
    }
};

const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState("dark");
    const toggleTheme = () => setMode(m => m === "dark" ? "light" : "dark");
    const value = useMemo(() => ({ mode, theme: themes[mode], toggleTheme }), [mode]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

const Header = ({ date, onPrev, onNext, onToday }) => {
    const { theme, mode, toggleTheme } = useContext(ThemeContext);
    const { t } = useTranslation();
    const monthNames = useMemo(() => t('calendar.monthNames', { returnObjects: true }), [t]);

    return (
        <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
            <Text style={[styles.headerText, { color: theme.headerText }]}>
                {monthNames[date.getMonth()]} {date.getFullYear()}
            </Text>
            <View style={styles.headerControls}>
                <Pressable onPress={onPrev} style={styles.headerButton}>
                    <Text style={[styles.headerButtonText, { color: theme.headerText }]}>◀</Text>
                </Pressable>
                <Pressable onPress={onNext} style={styles.headerButton}>
                    <Text style={[styles.headerButtonText, { color: theme.headerText }]}>▶</Text>
                </Pressable>
                <Pressable onPress={toggleTheme} style={styles.headerButton}>
                    <Text style={[styles.headerButtonText, { color: theme.headerText }]}>
                        {mode === "dark" ? "🌞" : "🌙"}
                    </Text>
                </Pressable>
                <Pressable onPress={onToday} style={styles.headerButton}>
                    <Text style={[styles.todayButton, { borderColor: theme.accent, color: theme.headerText }]}>
                        {t('calendar.today')}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const sameDay = (a, b) =>
    a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const Day = ({ day, isCurrentMonth, isToday, isStart, isEnd, inRange, onPress }) => {
    const { theme } = useContext(ThemeContext);
    const container = [styles.dayContainer];
    const text = [styles.dayText, { color: isCurrentMonth ? theme.textPrimary : theme.textSecondary }];

    if (isToday) container.push({ borderColor: theme.todayAccentBorder, borderWidth: 3, borderRadius: 4, backgroundColor: theme.todayAccent });
    if (inRange) container.push({ backgroundColor: theme.accent + "55" });
    if (isStart || isEnd) {
        container.push({ backgroundColor: theme.accent });
        text.push({ color: theme.bg, fontWeight: "bold" });
    }

    return (
        <Pressable style={container} onPress={() => onPress(day)}>
            <Text style={text}>{day.getDate()}</Text>
        </Pressable>
    );
};

const Calendar = () => {
    const { theme } = useContext(ThemeContext);
    const { t, i18n } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const today = new Date();

    const goToPrevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    const goToNextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    const onSelectDate = date => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
            return;
        }
        if (!endDate) {
            if (date < startDate) {
                setEndDate(startDate);
                setStartDate(date);
            } else if (sameDay(date, startDate)) {
                setStartDate(null);
                setEndDate(null);
            } else {
                setEndDate(date);
            }
        }
    };

    const daysOfWeek = useMemo(() => t('calendar.weekdaysShort', { returnObjects: true }), [t]);
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0);
        const startDay = (startOfMonth.getDay() + 6) % 7;
        const daysInMonth = endOfMonth.getDate();
        const prevEnd = new Date(year, month, 0).getDate();
        const days = [];
        for (let i = startDay - 1; i >= 0; i--) days.push({ date: new Date(year, month - 1, prevEnd - i), isCurrentMonth: false });
        for (let i = 1; i <= daysInMonth; i++) days.push({ date: new Date(year, month, i), isCurrentMonth: true });
        for (let i = 1; days.length + i <= 42; i++) days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
        return days;
    }, [currentDate, t]);

    return (
        <View style={[styles.calendarWrapper, { backgroundColor: theme.bg }]}>
            <Header date={currentDate} onPrev={goToPrevMonth} onNext={goToNextMonth} onToday={goToToday} />
            <View style={styles.daysRow}>
                {daysOfWeek.map((d, idx) => (
                    <View key={idx} style={styles.dayHeaderCell}>
                        <Text style={[styles.dayHeaderText, { color: theme.textSecondary }]}>{d}</Text>
                    </View>
                ))}
                {calendarDays.map(({ date, isCurrentMonth }) => {
                    const isStart = sameDay(date, startDate);
                    const isEnd = sameDay(date, endDate);
                    const inRange = startDate && endDate && date > startDate && date < endDate;
                    return (
                        <Day
                            key={date.toDateString()}
                            day={date}
                            isCurrentMonth={isCurrentMonth}
                            isToday={sameDay(date, today)}
                            isStart={isStart}
                            isEnd={isEnd}
                            inRange={inRange}
                            onPress={onSelectDate}
                        />
                    );
                })}
            </View>
            <Pressable onPress={() => i18n.changeLanguage(i18n.language === 'en' ? 'uk' : 'en')}>
                <Text style={{ color: theme.textPrimary }}> [ [ Switch Language ] ] </Text>
            </Pressable>
        </View>
    );
};

const CalendarScreen = () => (
    <ThemeProvider>
        <Calendar />
    </ThemeProvider>
);

export default CalendarScreen;

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
    },
    headerButton: {
        padding: 8,
        marginLeft: 4,
    },
    headerControls: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerButtonText: {
        fontSize: 22,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    calendarWrapper: {
        flex: 1,
        padding: 8,
    },
    dayContainer: {
        width: "14.28%",
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
    },
    dayText: {
        fontSize: 16,
        textAlign: "center",
    },
    todayButton: {
        fontSize: 13,
        fontWeight: "bold",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 2,
        borderRadius: 20,
    },
    daysRow: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    dayHeaderCell: {
        width: "14.28%",
        alignItems: "center",
        paddingVertical: 8,
    },
    dayHeaderText: {
        fontSize: 12,
        fontWeight: "600",
    },
});

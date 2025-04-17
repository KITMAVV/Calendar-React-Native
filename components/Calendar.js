import React, {useState} from "react";
import {View, Text, Pressable, StyleSheet} from 'react-native';

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
const monthName = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];

const Header = ({date, onPrev, onNext, onToday}) => (
    <View style={styles.header}>
        <Text style={styles.headerText}>{monthName[date.getMonth()]} {date.getFullYear()}</Text>
        <View style={styles.headerControls}>
            <Pressable onPress={onNext} style={styles.headerButton}><Text style={styles.headerButtonText}>△</Text></Pressable>
            <Pressable onPress={onPrev} style={styles.headerButton}><Text style={styles.headerButtonText}>▽</Text></Pressable>
            <Pressable onPress={onToday}><Text style={styles.todayButton}>Сьогодні</Text></Pressable>
        </View>
    </View>
)

const Day = ({day, isCurrentMonth, isToday}) => {
    const container = [styles.dayContainer];
    const text = [styles.dayText, isCurrentMonth ? styles.dayTextActive : styles.dayTextInactive];
    if (isToday) {
        container.push(styles.todayContainer);
        text.push(styles.todayText)
    }
    return (
        <View style={container}>
            <Text style={text}>{day.getDate()}</Text>
        </View>
    )
}


const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();

    const goToPrevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    const goToNextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0); //лайфхак
        const startDay = (startOfMonth.getDay() + 6) % 7; //щоб перший день неділі пн, бо повертається як нд
        const daysInMonth = endOfMonth.getDate();
        const prevEnd = new Date(year, month, 0).getDate();//попередн місяць кінц дата
        const days = [];


        for (let i = startDay - 1; i >= 0; i--) { // попер дні
            days.push({date: new Date(year, month - 1, prevEnd - i), isCurrentMonth: false});
        }
        for (let i = 1; i <= daysInMonth; i++) {//поточні дні
            days.push({date: new Date(year, month, i), isCurrentMonth: true});
        }
        const nextCount = 42 - days.length;
        for (let i = 1; i <= nextCount; i++) {
            days.push({date: new Date(year, month + 1, i), isCurrentMonth: false});
        }
        return days;
    };
    const calendarDays = getCalendarDays();

    return (
        <View style={styles.CalendarWrapper}>
            <Header date={currentDate} onPrev={goToPrevMonth} onNext={goToNextMonth} onToday={goToToday}/>
            <View style={styles.daysRow}>
                {daysOfWeek.map(d => (
                    <View key={d} style={styles.dayHeaderCell}><Text style={styles.dayHeaderText}>{d}</Text></View>
                ))}
                {calendarDays.map(dayObj => (
                    <Day
                        key={dayObj.date.toDateString()}
                        day={dayObj.date}
                        isCurrentMonth={dayObj.isCurrentMonth}
                        isToday={dayObj.date.toDateString() === today.toDateString()}
                    />
                ))}
            </View>
        </View>
    )

}


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
    },
    headerButton: {
        padding: 8,
    },
    headerControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButtonText: {
        color: '#fff',
        fontSize: 22,
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    dayContainer: {
        width: '14.28%',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    CalendarWrapper: {
        flex: 1,
        padding: 8,
        backgroundColor: '#1e1e1e',
    },
    dayText: {
        fontSize: 16,
        textAlign: 'center',
    },
    dayTextInactive: {
        color: '#666',
    },
    dayTextActive: {
        color: '#fff',
    },
    todayContainer: {
        borderWidth: 2,
        borderColor: '#ff7f00',
        borderRadius: 4,
    },
    todayText: {
        backgroundColor: '#ff7f00',
        color: '#000',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    todayButton: {
        color: '#fff',
        borderColor: '#ff7f00',
        borderWidth: 2,
        borderRadius: 20,
        padding: 10,
    },
    daysRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayHeaderCell: {
        width: '14.28%',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dayHeaderText: {
        color: '#ccc',
        fontSize: 12,
        fontWeight: '600',
    }

})
//стилі дав пан gpt(тільки для хедеру і його вмісту, бо не встигав(але хоча б гарно).

export default Calendar;

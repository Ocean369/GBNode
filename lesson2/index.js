
const EventEmitter = require('events');

const emitter = new EventEmitter();


class EndDate {
    constructor(emit, name, date) {
        this.emit = emit
        this.name = name
        this.date = {
            year: date[4],
            month: date[3],
            day: date[2],
            minute: date[1],
            hour: date[0]
        }
        this.create()
    }

    create() {
        this.emit.emit('timer', this);
    }
}


emitter.on('timer', (Obj) => {
    var timer = setInterval(() => {
        // Получение времени сейчас
        let now = new Date();
        // Получение заданного времени
        let end_date = new Date(Obj.date.year, Obj.date.month, Obj.date.day, Obj.date.hour, Obj.date.minute);
        // Вычисление разницы времени 
        let ms_left = end_date - now;
        // Если разница времени меньше или равна нулю 
        if (ms_left <= 0) { // То
            clearInterval(timer);
            console.log(`${Obj.name} завершил свою работу!`)
        } else { // Иначе
            // Получаем время зависимую от разницы
            let res = new Date(ms_left);
            // Делаем строку для вывода
            let str_timer = `${Obj.name} - осталось ${res.getUTCFullYear() - 1970} лет ${res.getUTCMonth()} месяцев ${res.getUTCDate() - 1} дней ${res.getUTCHours()} часов ${res.getUTCMinutes()} минут ${res.getUTCSeconds()} секунд`;
            // Выводим время
            console.log(str_timer);
        }
    }, 1000)
});


let argDate = process.argv.splice(2).map(item => {
    let newItem = item.split('-');
    newItem[3]--;
    return newItem
})

for (let i = 0; i < argDate.length; i++) {
    new EndDate(emitter, `Timer ${i + 1}`, argDate[i]);
}


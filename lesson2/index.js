
const EventEmitter = require('events');

const emitter = new EventEmitter();


class EndDate {
    constructor(emit, name, date) {
        this.emit = emit
        this.name = name
        this.argArr = date.split('-')
        this.date = ''
        this.create()
    }
    #checkDate() {
        let result = true
        this.argArr.forEach((val, ind) => {
            if ((ind !== 4 && val.length !== 2) || (ind === 4 && val.length !== 4)) { result = false }
        });
        return result
    }
    create() {
        if (this.#checkDate()) {
            this.date = `${this.argArr[4]}-${this.argArr[3]}-${this.argArr[2]}T${this.argArr[0]}:${this.argArr[1]}:00`;
            this.emit.emit('timer', this);
        }
        else { console.log(`У ${this.name} не правильно введены данные`) }
    }
}


emitter.on('timer', (Obj) => {
    var timer = setInterval(() => {
        // Получение времени сейчас
        let now = new Date();
        // Получение заданного времени
        let end_date = new Date(Obj.date);
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


let argDate = process.argv.splice(2);

for (let i = 0; i < argDate.length; i++) {
    new EndDate(emitter, `Timer ${i + 1}`, argDate[i]);
}


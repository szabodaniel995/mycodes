function createTimer(destination, r=100) {
    const content = document.createElement("div");

    const h = (2*r)+0.1*r;
    const w = (2*r)+0.1*r;
    const x = w/2;
    const y = h/2;

    const perimeter = 2*r*Math.PI;

    content.innerHTML=`
        <svg width="${w}" height="${h}">
            <circle
            cx="${x}"
            cy="${y}"
            r="${r}"
            fill="transparent"
            stroke="blue"
            stroke-width="${r/12}"
            stroke-dasharray="${perimeter}"
            stroke-dashoffset="0"
            transform="rotate(-90 ${x} ${y})"
            ></circle>
        </svg>

        <div class="container timer" style="width: ${w}px; height: ${h}px">
            <input type="text" name="" id="" value="30.00" />
            <div class="container">
                <button id="start"><i class="fa-solid fa-play"></i></button>
                <button id="pause"><i class="fa-solid fa-pause"></i></button>
            </div>
        </div>
    `

    destination.append(content);

    const input = destination.querySelector("input");
    const start = destination.querySelector("#start");
    const pause = destination.querySelector("#pause");

    const circle = destination.querySelector("circle");

    class Timer {
        constructor(input, startButton, pauseButton, circleConfig) {
    
            this.input = input;
            this.startButton = startButton;
            this.pauseButton = pauseButton;
            this.interval = 0.02;
            this.startValue=input.value;

            this.circleOnChange=circleConfig.circleOnChange;
            this.circleOnTick=circleConfig.circleOnTick;
    
            input.addEventListener("change", this.onChange);
            startButton.addEventListener("click", this.onStart);
            pauseButton.addEventListener("click", this.onPause);
        };
    
        onChange = () => {
            const {startButton, timeRemaining} = this;

            if (timeRemaining>=0) {
                this.startValue = timeRemaining;
                this.circleOnChange();
                startButton.disabled=false;
            }
        };
    
        onStart = () => {
            const {startButton, interval} = this;

            startButton.disabled=true;
            this.onTick();
            this.timerId = setInterval(this.onTick, interval*1000);
        };
    
        onPause = () => {
            const {startButton, timeRemaining} = this;
            
            clearInterval(this.timerId);
            if (timeRemaining>0) startButton.disabled=false;
        };
    
        onTick = () => {
            const {timeRemaining, interval, startValue} = this;

            if (parseFloat(timeRemaining) <= 0) {
                this.onPause();
            }
            else {
                this.timeRemaining=this.timeRemaining - interval;
                this.circleOnTick(interval, startValue);
            }
        };

        get timeRemaining() {
            return parseFloat(this.input.value);
        };

        set timeRemaining(value) { 
            this.input.value=value.toFixed(2);
        };
    };
 
    const circleConfig = {
        circleOnChange: () => {
            circle.style.strokeDashoffset=0;
        },

        circleOnTick:  (interval, startValue) => {
            circle.style.strokeDashoffset-=perimeter*interval/startValue;
        }
    };

    return new Timer(input, start, pause, circleConfig);
};


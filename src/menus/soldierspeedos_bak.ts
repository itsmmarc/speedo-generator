type RGB = string;

const digits = document.getElementsByClassName('speedo') as HTMLCollection;   // collection of digit elements
const digitsArray = Array.prototype.slice.call(digits) as HTMLElement[];
let speedovalue: number = 0;
const framerate: number = 30;
const frametime: number = 1000/framerate;

// speedo digit counter
setInterval(function(){
    digitsArray.forEach(item => {
        item.textContent = speedovalue.toString();
        item.style.setProperty('color', getColor(item));
    });
    
    
    let sine_max: number = 3500;
    let sine_min: number = 0;
    let sine_period: number = 6
    let sine_rate: number = (sine_max - sine_min)/sine_period/frametime;

    speedovalue += Math.round(sine_rate);
    if(speedovalue>sine_max){
        speedovalue = sine_min;
    }
}, frametime);

// get speedo color
function getColor(item: HTMLElement): RGB{
    let speed: number;
    if(item.textContent){
        speed = parseInt(item.textContent);
    } else { return 'rgb(255, 255, 255)' }
    
    switch (true) {
        case item.classList.contains('HORIZONTAL'):
            if(isGood(speed)){
                return 'rgb(0, 255, 85)';
            }
            if(isClose(speed)){
                return 'rgb(35, 125, 235)'
            }
            return 'rgb(255, 255, 255)';
        default:
            return 'rgb(255, 255, 255)';
    }
}

// refactor later to deal with other speedo types
function isClose(speed: number){
    const HSPEEDO_CLOSE_MIN: number = 850;
    const HSPEEDO_CLOSE_MAX: number = 1350;
    if(speed>HSPEEDO_CLOSE_MIN && speed<HSPEEDO_CLOSE_MAX){
        return true;
    } else{ return false;}
}
function isGood(speed: number){
    const HSPEEDO_GOOD_MIN: number = 1050;
    const HSPEEDO_GOOD_MAX: number = 1150;
    if(speed>HSPEEDO_GOOD_MIN && speed<HSPEEDO_GOOD_MAX){
        return true;
    } else{ return false;}
}

// SHADOWS
const enableShadowsBtn = document.getElementById('shadows_enable') as HTMLElement;
const disableShadowsBtn = document.getElementById('shadows_disable') as HTMLElement;
const shadows = document.getElementsByClassName('digits shadow') as HTMLCollection;
const shadowsArray = Array.prototype.slice.call(shadows) as HTMLElement[];

enableShadowsBtn.addEventListener('click', () =>{
    shadowsArray.forEach(item => {
        if(item.classList.contains('hidden')){
            item.classList.remove('hidden');
        }
    })
})

disableShadowsBtn.addEventListener('click', () =>{
    shadowsArray.forEach(item => {
        if(!item.classList.contains('hidden')){
            item.classList.add('hidden');
        }
    })
})
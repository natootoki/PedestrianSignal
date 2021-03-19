let canvas = document.getElementById('stage');
let ctx = canvas.getContext('2d');

let player = {
    color:"#000000",
    head:128,
    blur:0.2,
    x:32,
    y:0,
    leg1x:0,
    leg2x:0,
    leg1y:0,
    leg2y:0,
    pivotleg:1,
    frontleg:1,
    leg_thickness:32,
    leg_height:32*3,
    leg_speed:3,
    speed:1
}
player.leg2x=player.head/2-player.leg_thickness/2-player.leg_speed;
player.leg1x=-player.head/2+player.leg_thickness/2+player.leg_speed;

let light = {
    state:"red",
    blue:"#33BBFF",
    red:"#FF0000",
    frame:4,
    width:32*1.5,
    height:32*2.5,
    pivot_thickness:8,
    pivot_height:8,
    propeller_length:32,
    propeller_angle:0,
    propeller_rotate:Math.PI/12,
    propeller_height:4,
    propeller_thickness:2,
    blur_amp:8,
    blur_angle:0,
    blur_rotate:Math.PI/60,
    blur:0
}

let camera = {
    x:0,
    y:0
}

player.x=window.innerWidth/4
player.y=window.innerHeight-player.head-128;

let min=1;
let max=100;
let a = Math.floor( Math.random() * (max + 1 - min) ) + min ;

document.body.style.overflow = "hidden";

const loop = () => {
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

    ctx.fillStyle="#FCD7A1";
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight);

    if(player.pivotleg==1){
        player.leg1x-=player.leg_speed*player.speed;
        player.leg2x+=player.leg_speed*player.speed;
    }else if(player.pivotleg==2){
        player.leg1x+=player.leg_speed*player.speed;
        player.leg2x-=player.leg_speed*player.speed;
    }
    if(player.leg1x<player.leg2x){
        player.frontleg=2;
    }else{
        player.frontleg=1;
    }
    if(player.leg1x>player.head/2-player.leg_thickness/2-player.leg_speed){
        player.pivotleg=1;
        if(light.state=="blue"){
            player.speed=1;
        }else if(light.state=="red"){
            player.speed=0;
        }
    }else if(player.leg2x>player.head/2-player.leg_thickness/2-player.leg_speed){
        player.pivotleg=2;
        if(light.state=="blue"){
            player.speed=1;
        }else if(light.state=="red"){
            player.speed=0;
        }
    }
    if(player.pivotleg==1){
        player.leg1y=0;
        player.leg2y=Math.cos(player.leg2x/(player.head/2-player.leg_thickness/2)*Math.PI/2)*player.leg_height;
    }else if(player.pivotleg==2){
        player.leg1y=Math.cos(player.leg1x/(player.head/2-player.leg_thickness/2)*Math.PI/2)*player.leg_height;
        player.leg2y=0;
    }
    player.x+=player.leg_speed*player.speed;
    if(player.x>=window.innerWidth/2){
        camera.x=player.x-window.innerWidth/2;
    }

    ctx.fillStyle=player.color;
    ctx.fillRect(player.x+player.leg1x-player.leg_thickness/2-camera.x,player.y-(player.leg1y+player.leg2y)/2*player.blur,player.leg_thickness,player.leg_height-player.leg1y+(player.leg1y+player.leg2y)/2*player.blur);
    ctx.fillRect(player.x+player.leg2x-player.leg_thickness/2-camera.x,player.y-(player.leg1y+player.leg2y)/2*player.blur,player.leg_thickness,player.leg_height-player.leg2y+(player.leg1y+player.leg2y)/2*player.blur);
    ctx.arc(player.x-camera.x,player.y-(player.leg1y+player.leg2y)/2*player.blur, player.head/2, 0 * Math.PI / 180, 360 * Math.PI / 180, false );
    ctx.fill();

    light.propeller_angle+=light.propeller_rotate;
    a = Math.floor( Math.random() * (max + 1 - min) ) + min ;
    if(a==1){
        if(light.state=="blue"){
            light.state="red";
        }else if(light.state=="red"){
            light.state="blue";
        }
    }
    light.blur_angle+=light.blur_rotate;
    light.blur=light.blur_amp*Math.cos(light.blur_angle);

    ctx.fillRect(player.x+128-camera.x,player.y-light.blur-128,light.width,light.height);
    ctx.fillRect(player.x+128+light.width/2-light.pivot_thickness/2-camera.x,player.y-light.pivot_height-light.blur-128,light.pivot_thickness,light.pivot_height);
    ctx.fillRect(player.x+128+light.width/2-light.propeller_length*Math.abs(Math.cos(light.propeller_angle))-camera.x,player.y-light.propeller_height-light.propeller_thickness-light.blur-128,light.propeller_length*2*Math.abs(Math.cos(light.propeller_angle)),light.propeller_thickness);
    if(light.state=="blue"){
        ctx.fillStyle=light.blue;
        ctx.fillRect(player.x+128+light.frame-camera.x,player.y-128+light.frame+light.height/2-light.frame*0.5-light.blur,light.width-light.frame*2,light.height/2-light.frame*1.5);
    }else if(light.state=="red"){
        ctx.fillStyle=light.red;
        ctx.fillRect(player.x+128+light.frame-camera.x,player.y-128+light.frame-light.blur,light.width-light.frame*2,light.height/2-light.frame*1.5);
    }

    window.requestAnimationFrame(loop);
}

loop();

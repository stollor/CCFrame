import { AudioClip, AudioSource ,Node, Scheduler} from "cc";
import { AudioType } from "../EnumMgr";
import { CMath } from "../utils/CMath";
import { CTween } from "../utils/CTween";

export class AudioNode{
    private _volume:number=1;
    private _volumeScale:number=1;

    public node:Node;
    public component:AudioSource;
    public loop:boolean=false;
    public fadeIn:boolean=false;
    public fadeOut:boolean=false;
    public audio:AudioType;
    public cb:Function;
    public cbOnec:Function;
    public debug:boolean=false;

    constructor(){
        this.node=new Node();
        this.component=this.node.addComponent(AudioSource);
        this.node.on(AudioSource.EventType.STARTED, this.onStart, this);
        this.node.on(AudioSource.EventType.ENDED, this.onEnd, this);
       
    }

    set volume(val){
         if(this.component.playing){
             CTween.FromTo(0.5,this._volume,val,(value)=>{
                 this.component.volume=CMath.limit(value*this._volumeScale,0,1);
             },'linear',()=>{this._volume=val})
         }else{
             this._volume=val;
         }
    }

    set volumeScale(val){
        if(this.component.playing){
             CTween.FromTo(0.5,this._volumeScale,val,(value)=>{
                 this.component.volume=CMath.limit(value*this._volume,0,1);
             },'linear',()=>{this._volumeScale=val})
         }else{
             this._volumeScale=val;
         }
    }

    get FinalVolume(){
        return CMath.limit(this._volume*this._volumeScale,0,1);
    }

    public play(){
        if(!this.audio) return;
        globalThis.resMgr.loadAudio(this.audio,(clip:AudioClip)=>{
            this.component.volume=this.FinalVolume;
            this.component.clip=clip;
            this.component.play();
            if(this.fadeOut) CTween.wait(this.component.duration*0.6,()=>{
                this.runFadeOut(0.4)
            });
        },this.debug)
    }

    public stop(){
        this.component.stop();
    }

    public playShoot(){
        if(!this.audio) return;
        globalThis.resMgr.loadAudio(this.audio,(clip:AudioClip)=>{
            this.component.volume=this.FinalVolume;
            this.component.playOneShot(clip);
            if(this.fadeOut) CTween.wait(this.component.duration*0.6,()=>{
                this.runFadeOut(0.4)
            });
             CTween.wait(this.component.duration,()=>{
                this.onEnd();
            });
        },this.debug)
    }

    private onStart(){
         this.runFadeIn();
    }

    private onEnd(){
        this.cb&&this.cb();
        this.cbOnec&&this.cbOnec();
        this.cbOnec=()=>{};
        if(this.loop) this.play();
        else{
            this.cb=()=>{};
        }
       
    }


    /**渐显效果 */
    private runFadeIn(scale:number=0.2,cb=()=>{}){
        if(this.debug)console.log(`渐显=>${this.audio}`)
        if(this.fadeIn && this.component.playing){
            if(this.debug)console.log(`渐显播放...`)
            let min=this.loop?0.3:0;
            CTween.FromTo(this.component.duration*scale,min,1,(val)=>{
                    this.component.volume=this.FinalVolume*val;
            },"quadIn",cb)
        }else{
            cb&&cb();
        }
    }

    /**渐隐效果 */
    private runFadeOut(scale:number=0.2,cb=()=>{}){
        if(this.debug)console.log(`渐隐=>${this.audio}`)
        if(this.fadeOut &&this.component.playing){
            if(this.debug)console.log(`渐隐播放...`)
            let min=this.loop?0.3:0;
            CTween.FromTo(this.component.duration*scale,1,min,(val)=>{
                    this.component.volume=this.FinalVolume*val;
            },"quadOut",cb)
        }else{
            cb&&cb();
        }
    }

    /**切换至 */
    public switchTo(type:AudioType,cb:Function=()=>{}){
        this.runFadeOut(0.1,()=>{
            this.component.stop();
            this.audio=type;
            this.play();
            cb&&cb();
        })
    }

   

}


export class AudioMgr{
    public BG:AudioNode;
    public Music:AudioNode;
    public Effect:AudioNode;
    public EffectOne:AudioNode;
    public Story:AudioNode;

    constructor(){
        this.BG=new AudioNode();
        this.Music=new AudioNode();
        this.Effect=new AudioNode();
        this.Story=new AudioNode();
    }

    public switchBG(type:AudioType,debug=false){
        this.BG.fadeIn=true;
        this.BG.fadeOut=true;
        this.BG.loop=true;
        this.BG.debug=debug;
        this.BG.switchTo(type);
    }

    public playMusic(type:AudioType,volume:number,loop:boolean=false,cb:Function=()=>{},debug:boolean=false){
        this.Music.fadeIn=true;
        this.Music.audio=type;
        this.Music.loop=loop;
        this.Music.cb=cb;
        this.Music.volume=volume;
        this.Music.debug=debug;
        this.Music.play();
    }

    public playEffect(type:AudioType,volume:number,loop:boolean=false,cb?:Function,debug:boolean=false){
        this.Effect.fadeIn=true;
        this.Effect.audio=type;
        this.Effect.loop=loop;
        this.Effect.cb=cb?cb:()=>null;
        this.Effect.volume=volume;
        this.Effect.debug=debug;
        this.Effect.play();
    }

    public playOneShot(type:AudioType,volume:number,cb:Function=()=>{},debug:boolean=false){
        this.EffectOne.fadeIn=true;
        this.EffectOne.audio=type;
        this.EffectOne.cb=cb;
        this.EffectOne.loop=false;
        this.EffectOne.volume=volume;
        this.EffectOne.debug=debug;
        this.EffectOne.playShoot();
    }

    public playStory(clip:AudioClip,volume:number,cb:Function=()=>{}){
        this.Story.component.volume=volume;
        this.Story.component.clip=clip;
        this.Story.loop=false;
        this.Story.cb=cb;
        this.Story.component.play();
    }

}
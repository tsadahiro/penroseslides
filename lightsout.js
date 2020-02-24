Vue.component('cell',{
    props:['x','y','v','idx'],
    data: function(){
	return {pallet: ["gray","yellow"],
	       }
    },
    template: '<rect  v-on:click="push()" @mouseover="hover()" width="100" height="100" v-bind:x="100*x" :y="100*y" stroke="black" :fill="pallet[v]" fill-opacity=0.5></rect>',
    methods:{
	push: function(){
	    this.$emit("toggle", this.idx);
	},
	hover: function(){
	    this.$emit("hover", this.idx);
	}
    }
})

Vue.component('lightsout', {
    props:['n'],
    data: function(){
	statarr = [];
	for (let i = 0; i < this.n; i++){
	    for (let j = 0; j< this.n; j++){
		statarr.push({x:i,y:j,v:1,idx:i*this.n+j});
	    }
	}
	return {status: statarr, msg:""};
    },
    template: '<div><p>{{ msg }}</p><svg width="350" height="350"> <cell v-for="(s,id) in status" v-on:toggle="pushed($event)" v-bind:key=id :idx=s.idx v-bind:x=s.x v-bind:y=s.y v-bind:v=s.v></cell></svg><button v-on:click="shuffle()">Shuffle</button></div>',
    methods:{
	pushed: function(key){
	    let  x = this.status[key].x;
	    let  y = this.status[key].y;
	    let  v = 1-this.status[key].v
	    let k = Number(key);
	    console.log(k);
	    this.status.splice(k, 1, {x:x, y:y, v:v, idx:k});
	    if (0 < x){
		let idx = k-Number(this.n);
		v = this.status[idx].v;
		this.status.splice(idx, 1, {x:(x-1), y:y, v:(1-v), idx:idx});
	    }
	    if (x < this.n-1){
		let idx = k + Number(this.n);
		v = this.status[idx].v;
		this.status.splice(idx, 1, {x:(x+1), y:y, v:(1-v), idx:idx});
	    }
	    if (0 < y){
		let idx = k-1
		v = this.status[idx].v;
		this.status.splice(idx, 1, {x:x, y:(y-1), v:(1-v), idx:idx});
	    }
	    if (y < this.n-1){
		let idx = k + 1;
		v = this.status[idx].v;
		this.status.splice(idx, 1, {x:x, y:(y+1), v:(1-v), idx:idx});
	    }
	    if (this.completed()){
		this.msg = "Completed!";
	    }
	},
	shuffle: function(){
	    console.log("clicked");
	    for (let idx = 0; idx < this.status.length; idx++){
		if (Math.random()>0.5){
		    this.pushed(idx);
		}
	    }
	    this.msg = null
	},
	completed: function(){
	    for (let idx = 0; idx < this.status.length; idx++){
		if (this.status[idx].v == 1){
		    return false;
		}
	    }
	    return true;
	}
    }
})

lightsout = new Vue({
    el: '#lightsout',
    template: '<lightsout n="3"></lightsout>'
})

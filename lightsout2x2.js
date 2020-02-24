Vue.component('cell',{
    props:['x','y','v','idx'],
    data: function(){
	return {pallet: ["gray","yellow"],
	       }
    },
    template: '<g v-on:click="push()"><rect width="80" height="80" v-bind:x="80*x" :y="80*y" stroke="black" :fill="pallet[v]" fill-opacity=0.5 ></rect><text v-bind:x="80*x+30" :y="80*y+50" stroke="blue" fill="blue">{{idx*1+1}}</text></g>',
    methods:{
	push: function(){
	    this.$emit("toggle", this.idx);
	},
    }
})

Vue.component('lightsout', {
    props:['n'],
    template: '<div><p>{{ msg }}</p><svg width="250" height="250"> <cell v-for="(s,id) in status" v-on:toggle="pushed($event)" v-bind:key=id :idx=s.idx v-bind:x=s.x v-bind:y=s.y v-bind:v=s.v></cell>'+
	'</svg><div v-html="math"></div></div>',
    data: function(){
	let statarr = [];
	let form = "\\tiny\\begin{matrix}"
	for (let i = 0; i < this.n; i++){
	    for (let j = 0; j< this.n; j++){
		if (i!=0 || j!=0){
		    form += "\\\\";
		}
		statarr.push({x:i,y:j,v:1,idx:i*this.n+j});
		form += "{\\tt\\color{blue} "+(i*this.n*1+j+1)+"}";
	    }
	}
	form += "\\end{matrix}";
	form += "\\begin{pmatrix}";
	for (let i in statarr){
	    if (i!=0){
		form += "\\\\";
	    }
	    form += statarr[i].v;
	}
	form += "\\end{pmatrix}";
	let math = "$$" + form + "$$";
	//let form = "\\sum";
	return {status: statarr,
		msg:"",
		form:form,
		math:math
	       };
    },
    methods:{
	pushed: function(key){
	    let  x = this.status[key].x;
	    let  y = this.status[key].y;
	    let  v = 1-this.status[key].v
	    let k = Number(key);
	    console.log(k);
	    let changed = [k];
	    this.status.splice(k, 1, {x:x, y:y, v:v, idx:k});
	    if (0 < x){
		let idx = k-Number(this.n);
		v = this.status[idx].v;
		this.status.splice(idx, 1, {x:(x-1), y:y, v:(1-v), idx:idx});
		changed.push(idx);
	    }
	    if (x < this.n-1){
		let idx = k + Number(this.n);
		v = this.status[idx].v;
		this.status.splice(idx, 1, {x:(x+1), y:y, v:(1-v), idx:idx});
		changed.push(idx);
	    }
	    if (0 < y){
		let idx = k-1
		v = this.status[idx].v;
		this.status.splice(idx, 1, {x:x, y:(y-1), v:(1-v), idx:idx});
		changed.push(idx);
	    }
	    if (y < this.n-1){
		let idx = k + 1;
		v = this.status[idx].v;
		this.status.splice(idx, 1, {x:x, y:(y+1), v:(1-v), idx:idx});
		changed.push(idx);
	    }
	    let vector =[];
	    for (let i=0; i<this.n*this.n; i++){
		vector.push(0);
	    }
	    for (let i of changed){
		vector[i]=1;
	    }
	    console.log(vector);
	    if (this.completed()){
		//this.msg = "Completed!";
	    }
	    this.form+="+\\begin{pmatrix}";
	    for (let i in vector){
		if (i!=0){
		    this.form += "\\\\";
		}
		this.form += vector[i];
	    }
	    this.form+="\\\\\\end{pmatrix}";
	    ansVecTeX = "\\begin{pmatrix}"
	    for (let i in this.status){
		if (i!=0){
		    ansVecTeX += "\\\\";
		}
		ansVecTeX += this.status[i].v;
	    }
	    ansVecTeX+="\\end{pmatrix}";
	    this.math="$$"+this.form+"="+ ansVecTeX+"$$";
	    this.$nextTick(function() {
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
		//let math = MathJax.Hub.getAllJax("MathDiv")[28];
		//MathJax.Hub.Queue(["Text", math, this.math]);    
            });
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
    el: '#lightsout2x2',
    template: '<lightsout n="3"></lightsout>'
})

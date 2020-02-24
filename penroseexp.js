Vue.component('penroseexp',{
    template: '<div><button v-if="!finished" @click="expand()">expand</button><button v-if="!finished" @click="subdivision()">divide</button><input type="range" v-model="exp" min=20 max=200><button v-if="!finished" @click="unify()">unify</button><br/><svg width=800 height=400><tile  v-for="(T,i) in polygons" :points="T.str" :col="T.col" :key="i"></tile></svg><br/><div>拡大細分回数：{{ndiv}}</div></div>',
    data(){
	return {A:[[[0,0,0,0,0],[1,0,0,0,0],[0,1,0,0,0]],
		   [[0,0,0,0,0],[0,0,1,0,0],[0,1,0,0,0]],
		   [[0,0,0,0,0],[0,0,1,0,0],[0,0,0,1,0]],
		   [[0,0,0,0,0],[0,0,0,0,1],[0,0,0,1,0]],
		   [[0,0,0,0,0],[0,0,0,0,1],[-1,0,0,0,0]],
		   [[0,0,0,0,0],[0,-1,0,0,0],[-1,0,0,0,0]],
		   [[0,0,0,0,0],[0,-1,0,0,0],[0,0,-1,0,0]],
		   [[0,0,0,0,0],[0,0,0,-1,0],[0,0,-1,0,0]],
		   [[0,0,0,0,0],[0,0,0,-1,0],[0,0,0,0,-1]],
		   [[0,0,0,0,0],[1,0,0,0,0],[0,0,0,0,-1]]
		  ],
		B:[],
		pif: 3.14159/5,
		exp:100,
		centx:400,
		centy:200,
		ndiv:0,
		finished:false,
	       }
    },
    computed:{
	polygons(){
	    let triangles = []
	    for (T of this.A){
		triangles.push({str:this.polygonString(T),col:"skyblue"});
	    }
	    for (T of this.B){
		triangles.push({str:this.polygonString(T),col:"pink"});
	    }
	    return triangles;
	},
    },
    methods:{
	add(x,y){
	    let X = [];
	    for (let i=0; i<5; i++){
		X.push(x[i]+y[i]);
	    }
	    return X;
	},
	sub(x,y){
	    let X = [];
	    for (let i=0; i<5; i++){
		X.push(x[i]-y[i]);
	    }
	    return X;
	},
	mul(x,a){
	    let X = [];
	    for (let i=0; i<5; i++){
		X.push(a*x[i]);
	    }
	    return X;
	},
	phi(p){
	    let X = [];
	    X.push(-p[4]);
	    for (let i=0; i<4; i++){
		X.push(p[i]);
	    }
	    for (let i=0; i<4; i++){
		X[i] += p[i+1];
	    }
	    X[4] -= p[0];
	    return X;
	},
	subdivpt(x,y){
	    return(this.sub(this.sub(this.mul(x,2),y),
			    this.phi(this.sub(x,y))));
	},
	clone(x){
	    let X = [];
	    for (let i=0; i<5; i++){
		X.push(x[i]);
	    }
	    return X;
	},
	expand(){
	    for (let po in this.A){
		for (let pt in this.A[po]){
		    this.A[po].splice(pt,1,this.phi(this.A[po][pt]));
		}
	    }
	    for (let po in this.B){
		for (let pt in this.B[po]){
		    this.B[po].splice(pt,1,this.phi(this.B[po][pt]));
		}
	    }
	    console.log(this.proj(this.subdivpt(this.A[0][0],this.A[0][1])));
	},
	subdivision(){
	    let nA=[];
	    let nB=[];
	    for (let T of this.A){
		nA.push([this.clone(T[2]), this.subdivpt(T[0],T[1]), this.clone(T[1])]);
		nB.push([this.clone(T[2]), this.clone(T[0]), this.subdivpt(T[0],T[1])]);
	    }
	    for (let T of this.B){
		let w = this.subdivpt(T[0],T[1]);
		let v = this.subdivpt(T[0],T[2]);
		nA.push([w, v, this.clone(T[2])]);
		nB.push([this.clone(w),this.clone(T[0]), this.clone(v)]);
		nB.push([this.clone(T[1]), this.clone(T[2]), this.clone(w)]);
	    }
	    this.A = nA;
	    this.B = nB;
	    console.log(nA.length, nB.length);
	    this.ndiv += 1;
	},
	canonical(x){
	    let y = [];
	    for (let i=0; i < 4; i++){
		y.push(x[i]);
	    }
	    for (let i=0; i < 4; i++){
		if (i%2==0){
		    y[i] -= x[4];
		}
		else{
		    y[i] += x[4];
		}
	    }
	    return y;
	},
	unify(){
	    let incAList = {};
	    let matchedA = [];
	    for (let t=0; t<this.A.length;t++){
		for (let s=t+1; s < this.A.length; s++){
		    let t1 = this.canonical(this.A[t][1]).toString();
		    let t2 = this.canonical(this.A[t][2]).toString();
		    let s1 = this.canonical(this.A[s][1]).toString();
		    let s2 = this.canonical(this.A[s][2]).toString();
		    //console.log([t1,t2, s1, s2]);
		    if (t1==s1 && t2==s2){
			console.log([t,s]);
			matchedA.push([this.A[t][0],this.A[t][1],this.A[s][0],this.A[t][2]]);
		    }
		}
	    }
	    let matchedB = [];
	    for (let t=0; t<this.B.length;t++){
    		for (let s=t+1; s < this.B.length; s++){
    		    let t1 = this.canonical(this.B[t][0]).toString();
    		    let t2 = this.canonical(this.B[t][1]).toString();
    		    let s1 = this.canonical(this.B[s][0]).toString();
    		    let s2 = this.canonical(this.B[s][1]).toString();
    		    if (t1==s1 && t2==s2){
    			matchedB.push([this.B[t][0],this.B[t][2],this.B[t][1],this.B[s][2]]);
    		    }
    		}
	    }
	    this.A = matchedA;
	    this.B = matchedB;
	    this.finished = true;
	},
	polygonString(T){
	    let pts = "";
	    for (let p of T){
		pts += (this.proj(p).x + "," + this.proj(p).y + " ");
	    }
	    return pts;
	},
	proj: function(p){
	    let sumx = 0;
	    let sumy = 0;
	    for (let i = 0; i<5; i++){
		sumx += p[i]*Math.cos(this.pif*i)
		sumy -= p[i]*Math.sin(this.pif*i)
	    }
	    return({x:this.centx+this.exp*sumx, y:this.centy+this.exp*sumy});
	},
    }
})

Vue.component('tile',{
    props: ['points', 'col','id'],
    template: '<polygon class="tile" v-bind:points="points" v-bind:style="styles" :fill="col"></polygon>',
    data: function(){
	return {
	    styles:{
		stroke: "black",
		opacity: 0.3
	    }
	};
    },
    methods:{
    }
})



penroseExp = new Vue({
    el: '#penroseexp',
    template: '<penroseexp></penroseexp>'
})

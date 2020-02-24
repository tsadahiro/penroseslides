Vue.component('penroseexp',{
    //template: '<svg width=800 height=400><circle v-for="(T,i) in polygons[0]" :cx="T.x" :cy="T.y" r="2"></circle></svg>',
    template: '<div><button @click="expand()">expand</button><button @click="subdivision()">divide</button><input type="range" v-model="exp" min=20 max=200><br/><svg width=800 height=400><tile v-for="(T,i) in polygons" :points="T.str" :col="T.col"></tile></svg></div>',
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
		centy:200
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
    template: '<polygon v-bind:points="points" v-bind:style="styles"></polygon>',
    data: function(){
	return {
	    styles:{
		fill: this.col,
		stroke: "black",
		opacity: 0.3
	    }
	};
    },
    methods:{
	//hover: function(){
	//    this.$emit("hovered",this.id);
	//    this.styles.opacity=1;
	//    return;
	//},
	//hout: function(){
	//    this.$emit("hout",this.id);
	//    this.styles.opacity=0.3;
	//    return;
	//}
    }
})



penroseExp = new Vue({
    el: '#penroseexp',
    template: '<penroseexp></penroseexp>'
})

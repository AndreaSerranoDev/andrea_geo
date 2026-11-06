import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze,shearModulus} from '../calculations.js';
const layer=(thickness,vs,density=2000)=>({thickness,vs,density});
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('uniform 30 m profile matches analytical solution',()=>{const r=analyze([layer(30,200)]);close(r.vs30,200);close(r.travelTime,.15);close(r.period,.6);close(shearModulus(layer(30,200)),80);});
test('Vs30 truncates a layer at 30 m, excluding deeper properties',()=>{const r=analyze([layer(10,100),layer(30,400),layer(10,900)]);close(r.vs30,200);close(r.depth,50);close(r.travelTime,.1+.075+10/900);});
test('shallow profile does not extrapolate Vs30',()=>assert.equal(analyze([layer(10,200)]).vs30,null));
test('invalid profiles are rejected',()=>{for(const ls of [[],[layer(0,200)],[layer(1,-1)],[layer(1,NaN)],[layer(1,200,0)],[layer(Infinity,200)]])assert.throws(()=>analyze(ls));});

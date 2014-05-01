var common = require('./common');
var TYPE_SIZE = common.TYPE_SIZE;
var checkBufferSize = common.checkBufferSize;

var Serialize = function(maxsize){
    this.buf = new Buffer(maxsize);
    this.pos = 0;
}

var push = function(tbl, s, v){
    var old = s.pos;
    checkBufferSize(s, tbl.size);
    tbl.func.call(s.buf, v, s.pos)
    s.pos += tbl.size;
    return old;
}

Serialize.prototype.getBuffer = function(){
    return this.buf.slice(0, this.pos);
}

var TBL = {
    INT8 : {size:TYPE_SIZE.INT8,func:Buffer.prototype.writeInt8},
    UINT8 : {size:TYPE_SIZE.UINT8,func:Buffer.prototype.writeUInt8},
    INT16 : {size:TYPE_SIZE.INT16,func:Buffer.prototype.writeInt16BE},
    UINT16 : {size:TYPE_SIZE.UINT16,func:Buffer.prototype.writeUInt16BE},
    INT32 : {size:TYPE_SIZE.INT32,func:Buffer.prototype.writeInt32BE},
    UINT32 : {size:TYPE_SIZE.UINT32,func:Buffer.prototype.writeUInt32BE},
    FLOAT : {size:TYPE_SIZE.FLOAT,func:Buffer.prototype.writeFloatBE},
    DOUBLE : {size:TYPE_SIZE.DOUBLE,func:Buffer.prototype.writeDoubleBE},
};

Serialize.prototype.push_int8 = function(val){ return push(TBL.INT8, this, val); }
Serialize.prototype.push_uint8 = function(val){ return push(TBL.UINT8, this, val); }
Serialize.prototype.push_int16 = function(val){ return push(TBL.INT16, this, val); }
Serialize.prototype.push_uint16 = function(val){ return push(TBL.UINT16, this, val); }
Serialize.prototype.push_int32 = function(val){ return push(TBL.INT32, this, val); }
Serialize.prototype.push_uint32 = function(val){ return push(TBL.UINT32, this, val); }
Serialize.prototype.push_float = function(val){ return push(TBL.FLOAT, this, val); }
Serialize.prototype.push_double = function(val){ return push(TBL.DOUBLE, this, val); }

Serialize.prototype.push_string = function(val, max){
    var old = this.pos;
    if(max === undefined){
        max = 1024;
    }
    var size = Buffer.byteLength(val, 'utf8');
    if(size > max){
        throw new Error('string max over');
    }
    checkBufferSize(this, TYPE_SIZE.UINT16 + size);
    this.push_uint16(size);
    this.buf.write(val, this.pos, size, 'utf8');
    this.pos += size;
    return old;
}

Serialize.prototype.push_array = function(list, callback){
    var old = this.pos;
    if(!(list instanceof Array)){
        throw new Error('param is no array');
    }
    var len = list.length;
    this.push_uint16(len);
    for(var i=0; i < len; ++i){
        callback(list[i]);
    }
    return old;
}

if(!module.parent){
var s = new Serialize(1024);
s.push_int8(127);
s.push_int16(127);
s.push_int32(127);
s.push_string('xxx');
s.push_array([1,2,3,4,5], function(v){
    s.push_int8(v);
});
console.log(s.getBuffer())
}


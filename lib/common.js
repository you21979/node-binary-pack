var TYPE_SIZE = exports.TYPE_SIZE = {
    INT8 : 1,
    INT16 : 2,
    INT32 : 4,
    UINT8 : 1,
    UINT16 : 2,
    UINT32 : 4,
    FLOAT : 4,
    DOUBLE : 8,
};

var checkBufferSize = exports.checkBufferSize = function(s, size){
    if(s.buf.length < s.pos + size){
        throw new Error('buffer size over');
    }
}

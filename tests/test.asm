set r10 1
set r0 0
set r1 10
brsm r0 r1 4 
sw r0 r1 0
add r0 r10
jmp -3 
sw r0 r0 1
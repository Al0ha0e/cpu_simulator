set r1 1
lw r2 r0 0
set r3 1
brsm r1 r2 8
lw r4 r1 0
lw r5 r2 0
sw r5 r1 0
sw r4 r2 0
add r1 r3
sub r2 r3
jmp -7
stp
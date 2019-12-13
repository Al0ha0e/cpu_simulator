set r3 0
set r5 0
set r6 17
set r7 0
brsm r5 r6 4 
sw r7 r5 0
addimm r5 r5 1
jmp -3
set r5 0
breq r5 r3 2
jmp -1
addimm r11 r3 0
put r11
set r6 8 -------------------------------------------
breq r6 r11 9 if_input==backspace
set r6 0
lw r7 r6 0
breq r7 r6 2
jmp 3
addimm r7 r7 -1
sw r7 r6 0
set r3 0
jmp -13
set r6 13 ----------------------------------------
breq r6 r11 2 if_input==enter
jmp 10
lw r6 r5 0
set r7 16
breq r6 r7 2
addimm r6 r6 -1
addimm r6 r6 1
sw r6 r5 0
sw r11 r6 0
set r3 0
jmp -25
set r6 0 -----------------------------------------------
lw r7 r5 0
brsm r6 r7 5
lw r8 r7 0
put r8
addimm r7 r7 -1
jmp -4
set r6 13
put r6
set r6 0
sw r6 r5 0
set r3 0
jmp -38
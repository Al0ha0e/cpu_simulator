set r0 146           goto&irrupt_start_tmp_addr
set r5 1
sw r5 r1 16
set r5 2
sw r5 r1 1
set r5 15
sw r5 r1 8
set r6 8
set r7 1
brsm r6 r5 5
sw r7 r6 1
addimm r7 r7 1
addimm r6 r6 1
jmp -4
eirev
open
set r3 0  $main_loop
set r5 1
sw r5 r5 -1 set_wflg=1
set r5 0
breq r3 r5 2 
jmp -1
sw r5 r5 0
put r3
set r7 13
breq r7 r3 -9 if_char==enter
set r6 2
sw r6 r5 1
lw r6 r5 2 get_first_char
set r7 69 ----------------------------------------------------------------------
breq r7 r6 26 if_first_char==e
eirev do_not_irrupt
lw r4 r5 8
set r6 8
breq r4 r6 9 if_ava_th==0
set r4 66
put r4
set r4 65
put r4
set r4 13
put r4
eirev
jmp -26 go_back_to_$main_loop
lw r6 r4 0  r6=get_an_pid
addimm r4 r4 -1 
sw r4 r5 8
set r4 1
sw r4 r6 16 mark_pid_as_occupied
set r4 2
sw r4 r5 16
addimm r1 r6 0 set_pid
set r4 16 system_restart_pos
sw r4 r5 32
exe
set r3 0
jmp 151 goto_$copy_reg_back
set r7 81 key_q--------------------------------------------------------------------------
breq r7 r6 12 else_if_first_char==q
set r6 81
put r6
set r6 85
put r6
set r6 73
put r6
set r6 84
put r6
set r6 13
put r6
stp
set r7 76 key_l---------------------------------------------------------------------------
breq r7 r6 25 else_if_first_char==l
eirev do_not_irrupt
lw r4 r5 4 r4=get_third_char
lw r6 r4 -32 get_pid_state
set r7 2
breq r6 r7 10 if_pstate==2
set r6 1
sw r6 r4 -32 set_pid_state
set r6 2
sw r6 r5 16
addimm r1 r4 -48 set_pid
set r4 16 system_restart_pos
sw r4 r5 32
set r3 0
jmp 122 goto_$copy_reg_back
set r4 69
put r4
set r4 82
put r4
set r4 82
put r4
set r4 13
put r4
eirev
jmp -78 go_back_to_$main_loop
set r7 80 key_p--------------------------------------------------------------------------
breq r7 r6 11 else_if_first_char==p
set r6 0
set r7 8
brsm r6 r7 5
lw r8 r6 16
put r8
addimm r6 r6 1
jmp -4
set r6 13
put r6
jmp -90 go_back_to_$main_loop
set r7 75 key_k--------------------------------------------------------------------------
breq r7 r6 -92 else_if_first_char==k
lw r7 r5 4 r7=get_third_char
addimm r7 r7 -48
lw r6 r7 16 get_pid_state
set r8 2 
breq r6 r8 2
jmp 10 equal
set r6 69
put r6
set r6 82
put r6
set r6 82
put r6
set r6 13
put r6
jmp -107 go_back_to_$main_loop
set r6 32 calc_state_pos
set r8 0
brsm r8 r7 4 
addimm r6 r6 8
addimm r8 r8 1
jmp -3
addimm r8 r6 8
brsm r6 r8 4 clear
sw r5 r6 0
addimm r6 r6 1
jmp -3
set r6 0
sw r6 r7 16 set_pid_state
lw r6 r5 8
addimm r6 r6 1
sw r7 r6 0 release_given_pid
sw r6 r5 8 
set r6 75
put r6
set r6 13 
put r6 ---------------------------------------------------------------------------------
jmp -129 go_back_to_$main_loop
set r4 24           $irrupt_start_tmp_addr
sw r2 r4 0 pc
sw r5 r4 1
sw r6 r4 2
sw r7 r4 3
sw r8 r4 4
sw r9 r4 5
sw r10 r4 6
sw r11 r4 7
set r5 0
add r5 r1
set r6 0 
set r7 32
brsm r6 r5 4
addimm r7 r7 8
addimm r6 r6 1
jmp -3
set r6 24 copy_tmp_to_p
set r5 32
brsm r6 r5 6
lw r8 r6 0
sw r8 r7 0
addimm r7 r7 1 
addimm r6 r6 1
jmp -5
set r5 27 escape
breq r5 r3 11        if_keycode==escape---------------------------
set r4 0
set r3 0
breq r1 r4 2 if_pid==0
jmp 3
set r4 2 set_pid_state
sw r4 r1 16
set r4 1 set_current_pid_state
sw r4 r4 15
set r1 0            go_back_to_system
jmp 24              goto_$copy_reg_back-----------------------------
set r4 0            if_keycode!=escape
lw r5 r4 0          get_inflag
breq r4 r5 3        if_inflag==false
addimm r3 r3 0
jmp 19             goto_$copy_reg_back
set r4 8            if_keycode==backspace------------------
breq r3 r4 6
set r4 1
lw r5 r4 0
addimm r5 r5 -1
sw r5 r4 0
jmp 12             goto_$copy_reg_back---------------------
set r4 0
lw r5 r4 1          get_len
set r4 7            max_len
brsm r5 r4 6        if_len<max_len
sw r3 r5 0
addimm r5 r5 1
set r4 0
sw r5 r4 1
jmp 3
set r3 13           force_enter
sw r3 r5 0          set_char
set r5 0            $copy_reg_back
add r5 r1
set r6 0 
set r4 32
brsm r6 r5 4
addimm r4 r4 8
addimm r6 r6 1
jmp -3
lw r2 r4 0
lw r5 r4 1
lw r6 r4 2
lw r7 r4 3
lw r8 r4 4
lw r9 r4 5
lw r10 r4 6
lw r11 r4 7
iret r2 0
set r4 32 handle_return------------------------------------------------
set r5 0
brsm r5 r1 4
addimm r4 r4 8
addimm r5 r5 1
jmp -3
addimm r5 r4 8
set r6 0
brsm r4 r5 4
sw r6 r4 0
addimm r4 r4 1
jmp -3
set r4 0
sw r4 r1 16
lw r5 r4 8
addimm r5 r5 1
sw r5 r4 8
sw r1 r5 0
set r5 1
sw r5 r4 16
lw r2 r4 32
set r1 0
set r3 0
iret r2 0
%{
    #include <stdio.h>
    #include <stdlib.h>
    
    int yylex();
    void yyerror(const char *s);
%}

%union {
    float fval;
    int ival;
}

%token FAR NEAR
%token OD OS AO
%token COLON
%token SPH AXIS CYL ADD

%token DP NP AV PRISM

%token <fval> NUMBER 
%token <ival> DEGREE

%%

prescription:
    prescription_far
    | prescription_near
    | prescription_far prescription_near
    ;
prescription_far:
    FAR COLON eye_block
    ;

prescription_near:
    NEAR COLON eye_block
    ;

eye_block:
    single_block
    | both_block
    ;

single_block:
    single_eye
    | single_eye single_eye
    ;

both_block:
    AO COLON eye_parameters
    ;
    
single_eye:
    OD COLON eye_parameters
    | OS COLON eye_parameters
    ;    

eye_parameters:
    sphere
    | sphere cylinder axis
    ;

sphere:
    SPH NUMBER
    ;

cylinder:
    CYL NUMBER
    ;

axis:
    AXIS DEGREE
    ;

%%

void yyerror(const char *s) {
    fprintf(stderr, "Error: %s\n", s);
}
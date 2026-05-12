%{
    #include <stdio.h>
    #include <stdlib.h>
    #include <string.h>
    #include "prescription.h"
    
    int yylex();
    void yyerror(const char *s);
    Prescription current_prescription = {0};
%}

%union {
    float fval;
    int ival;

    EyeParams eye_params;
    EyeBlock eye_block;
}

%token FAR NEAR
%token OD OS AO
%token COLON
%token SPH AXIS CYL ADD

%token DP NP AV PRISM

%token <fval> NUMBER 
%token <ival> DEGREE

%type <eye_params> eye_parameters sphere cylinder axis
%type <eye_block> eye_block single_block single_eye both_block

%%

prescription:
    base_prescription opt_fields
    ;

base_prescription:
    prescription_far {
        current_prescription.has_farsight = 1;
    }
    | prescription_near {
        current_prescription.has_nearsight = 1;
    }
    | prescription_far prescription_near {
        current_prescription.has_farsight = 1;
        current_prescription.has_nearsight = 1;
    }
    ;

prescription_far:
    FAR COLON eye_block {
        current_prescription.farsight = $3;
    }
    ;

prescription_near:
    NEAR COLON eye_block {
        current_prescription.nearsight = $3;
    } 
    ;

eye_block:
    single_block {$$ = $1;}
    | both_block {$$ = $1;}
    ;

single_block:
    single_eye {$$ = $1;}
    | single_eye single_eye {
        $$ = $1;
        if ($2.has_od) {
            $$.od = $2.od;
            $$.has_od = 1;
        }
        if ($2.has_os) {
            $$.os = $2.os;
            $$.has_os = 1;
        }
    }
    ;

both_block:
    AO COLON eye_parameters {
        EyeBlock block = {0};
        block.has_ao = 1;
        block.ao = $3;
        $$ = block;
    }
    ;
    
single_eye:
    OD COLON eye_parameters {
        EyeBlock block = {0};
        block.has_od = 1;
        block.od = $3;
        $$ = block;
    }
    | OS COLON eye_parameters {
        EyeBlock block = {0};
        block.has_os = 1;
        block.os = $3;
        $$ = block;
    }
    ;    

eye_parameters:
    sphere {
        $$ = $1;
    }
    | sphere cylinder axis {
        $$ = $1;
        $$.cylinder = $2.cylinder;
        $$.axis = $3.axis;
    }
    ;

sphere:
    SPH NUMBER {
        EyeParams params = {0};
        params.sphere = $2;
        $$ = params;
    }
    ;

cylinder:
    CYL NUMBER {    
        EyeParams params = {0};
        params.cylinder = $2;
        $$ = params;
    }
    ;

axis:
    AXIS DEGREE {
        EyeParams params = {0};
        params.axis = $2;
        $$ = params;
    }
    ;

opt_fields:
    /* empty */
    | opt_fields opt_field
    ;
opt_field:
    ADD NUMBER {
        if (current_prescription.has_add) yyerror("Duplicate ADD");
        current_prescription.addition = $2;
        current_prescription.has_add = 1;
    }
    | DP NUMBER {
        if (current_prescription.has_dp) yyerror("Duplicate DP");
        current_prescription.pupillary_distance = $2;
        current_prescription.has_dp = 1;
    }
    | NP NUMBER {
        if (current_prescription.has_np) yyerror("Duplicate NP");
        current_prescription.near_point = $2;
        current_prescription.has_np = 1;
    }
    | AV NUMBER {
        if (current_prescription.has_av) yyerror("Duplicate AV");
        current_prescription.av = $2;
        current_prescription.has_av = 1;
    }
    | PRISM NUMBER {
        if (current_prescription.has_prism) yyerror("Duplicate PRISM");
        current_prescription.prism = $2;
        current_prescription.has_prism = 1;
    }
    ;

%%
extern int yylineno;

void yyerror(const char *s) {
    fprintf(stderr, "Error at line %d: %s\n", yylineno, s);
}
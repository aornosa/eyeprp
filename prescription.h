#ifndef PRESCRIPTION_H
#define PRESCRIPTION_H

#include <stdio.h>

typedef struct  
{
    float sphere;
    float cylinder;
    int axis;
}EyeParams;

typedef struct  
{
    EyeParams od;
    EyeParams os;
    EyeParams ao;

    int has_od;
    int has_os;
    int has_ao;
}EyeBlock;

typedef struct  
{
    EyeBlock farsight;
    EyeBlock nearsight;

    int has_farsight;
    int has_nearsight;

    
    float addition;
    int pupillary_distance;
    float near_point;
    float av;
    float prism;

    int has_add;
    int has_dp;
    int has_np;
    int has_av;
    int has_prism;
}Prescription;

extern Prescription current_prescription;

void prescription_to_json(FILE *output);

#endif /* PRESCRIPTION_H */

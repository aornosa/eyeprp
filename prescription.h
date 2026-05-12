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

    float addition;
    int pupillary_distance;
}EyeBlock;

typedef struct  
{
    EyeBlock farsight;
    EyeBlock nearsight;

    int has_farsight;
    int has_nearsight;
}Prescription;

extern Prescription current_prescription;

void prescription_to_json(FILE *output);

#endif /* PRESCRIPTION_H */

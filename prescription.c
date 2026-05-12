#include <stdio.h>
#include "prescription.h"

void prescription_to_json(FILE *output) {
    fprintf(output, "{\n");
    
    if (current_prescription.has_farsight) {
        fprintf(output, "  \"far\": {\n");
        EyeBlock *eb = &current_prescription.farsight;
        
        if (eb->has_od || eb->has_os) {
            fprintf(output, "    \"right_eye\": ");
            if (eb->has_od) {
                fprintf(output, "{\"sphere\": %.2f, \"cylinder\": %.2f, \"axis\": %d}",
                    eb->od.sphere, eb->od.cylinder, eb->od.axis);
            } else {
                fprintf(output, "null");
            }
            fprintf(output, ",\n");
            
            fprintf(output, "    \"left_eye\": ");
            if (eb->has_os) {
                fprintf(output, "{\"sphere\": %.2f, \"cylinder\": %.2f, \"axis\": %d}",
                    eb->os.sphere, eb->os.cylinder, eb->os.axis);
            } else {
                fprintf(output, "null");
            }
            fprintf(output, "\n");
        }
        
        if (eb->has_ao) {
            fprintf(output, "    \"both_eyes\": {\"sphere\": %.2f, \"cylinder\": %.2f, \"axis\": %d}\n",
                eb->ao.sphere, eb->ao.cylinder, eb->ao.axis);
        }
        
        fprintf(output, "  }");
        if (current_prescription.has_nearsight) {
            fprintf(output, ",\n");
        } else {
            fprintf(output, "\n");
        }
    }
    
    if (current_prescription.has_nearsight) {
        fprintf(output, "  \"near\": {\n");
        EyeBlock *eb = &current_prescription.nearsight;
        
        if (eb->has_od || eb->has_os) {
            fprintf(output, "    \"right_eye\": ");
            if (eb->has_od) {
                fprintf(output, "{\"sphere\": %.2f, \"cylinder\": %.2f, \"axis\": %d}",
                    eb->od.sphere, eb->od.cylinder, eb->od.axis);
            } else {
                fprintf(output, "null");
            }
            fprintf(output, ",\n");
            
            fprintf(output, "    \"left_eye\": ");
            if (eb->has_os) {
                fprintf(output, "{\"sphere\": %.2f, \"cylinder\": %.2f, \"axis\": %d}",
                    eb->os.sphere, eb->os.cylinder, eb->os.axis);
            } else {
                fprintf(output, "null");
            }
            fprintf(output, "\n");
        }
        
        if (eb->has_ao) {
            fprintf(output, "    \"both_eyes\": {\"sphere\": %.2f, \"cylinder\": %.2f, \"axis\": %d}\n",
                eb->ao.sphere, eb->ao.cylinder, eb->ao.axis);
        }
        
        fprintf(output, "  }\n");
    }

     int wrote_any = current_prescription.has_farsight || current_prescription.has_nearsight;

    if (current_prescription.has_add) {
        fprintf(output, "%s  \"add\": %.2f\n", wrote_any ? ",\n" : "", current_prescription.addition);
        wrote_any = 1;
    }
    if (current_prescription.has_dp) {
        fprintf(output, "%s  \"dp\": %d\n", wrote_any ? ",\n" : "", current_prescription.pupillary_distance);
        wrote_any = 1;
    }
    if (current_prescription.has_np) {
        fprintf(output, "%s  \"np\": %.2f\n", wrote_any ? ",\n" : "", current_prescription.near_point);
        wrote_any = 1;
    }
    if (current_prescription.has_av) {
        fprintf(output, "%s  \"av\": %.2f\n", wrote_any ? ",\n" : "", current_prescription.av);
        wrote_any = 1;
    }
    if (current_prescription.has_prism) {
        fprintf(output, "%s  \"prism\": %.2f\n", wrote_any ? ",\n" : "", current_prescription.prism);
        wrote_any = 1;
    }
    
    fprintf(output, "}\n");
}
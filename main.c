#include <stdio.h>
#include <stdbool.h>
#include "prescription.h"

int yyparse();

int main(int argc, char *argv[]) {
    FILE *input = stdin;
    
    // If a file is provided as argument, open it
    if (argc > 1) {
        input = fopen(argv[1], "r");
        if (!input) {
            perror("Cannot open file");
            return 1;
        }
        extern FILE *yyin;
        yyin = input;
    }
    
    // Parse the input
    if (yyparse() == 0) {
        // Parsing succeeded - output JSON to stdout
        prescription_to_json(stdout);
        
        // Optionally save to file
        FILE *json_out = fopen("prescription.json", "w");
        if (json_out) {
            prescription_to_json(json_out);
            fclose(json_out);
            printf("JSON saved to prescription.json\n");
        }
    } else {
        fprintf(stderr, "Parsing failed\n");
        return 1;
    }
    
    if (input != stdin) {
        fclose(input);
    }
    
    return 0;
}
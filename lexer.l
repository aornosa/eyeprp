%{
    #include "parser.tab.h"
    #include <stdio.h>
%}

%option noyywrap noinput nounput


DIGIT   [0-9]
NUMBER  [+-]?{DIGIT}+("."{DIGIT}+)?
DEGREE  {DIGIT}+[°º]

%%

"FAR"|"LEJOS"   { return FAR; }
"NEAR"|"CERCA"  { return NEAR; }

"OD"        { return OD; }
"OS"|"OI"   { return OS; }
"AO"        { return AO; }


"SPH"|"ESF"             { return SPH; }
"AX"|"AXS"|"AXIS"|"EJE" { return AXIS; }
"CYL"|"CIL"             { return CYL; }
"ADD"                   { return ADD; }


"DP"                    { return DP; }
"NP"                    { return NP; }
"AV"                    { return AV; }
"PRISM"|"PRISMA"        { return PRISM; }


":"     { return COLON; }

{NUMBER}  { yylval.fval = (float)atof(yytext); return NUMBER; }
{DEGREE}  { yylval.ival = atoi(yytext); return DEGREE; }

[ \t\n]+   { /* skip whitespace */ }

. {
    fprintf(stderr, "Unexpected character: %s\n", yytext);
    return yytext[0];
}

%%
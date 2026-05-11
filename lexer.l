%{
    #include "parser.tab.h"
    #include <stdio.h>
%}

%option noyywrap


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

/*Optional*/
"DP"                    { return DP; }
"NP"                    { return NP; }
"AV"                    { return AV; }
"PRISM"|"PRISMA"        { return PRISM; }


":"     { return COLON; }

{NUMBER}  { yylval.num = (float)atof(yytext); return NUMBER; }
{DEGREE}  { yylval.num = atof(yytext); return DEGREE; }

[ \t\n]+   { /* skip whitespace */ }

. {
    fprintf(stderr, "Unexpected character: %s\n", yytext);
    return yytext[0];
}

%%
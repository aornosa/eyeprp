CC = gcc
BISON = bison
FLEX = flex

CFLAGS = -Wall
LDFLAGS = -lfl

TARGET = eyeprp

SRC_BISON = parser.y
SRC_FLEX = lexer.l

BISON_OUT = parser.tab.c
BISON_HEADER = parser.tab.h
FLEX_OUT = lex.yy.c

all: $(TARGET)

$(TARGET): $(BISON_OUT) $(FLEX_OUT)
	$(CC) $(CFLAGS) $(BISON_OUT) $(FLEX_OUT) -o $(TARGET) $(LDFLAGS)

$(BISON_OUT) $(BISON_HEADER): $(SRC_BISON)
	$(BISON) -d $(SRC_BISON)

$(FLEX_OUT): $(SRC_FLEX) $(BISON_HEADER)
	$(FLEX) $(SRC_FLEX)

clean:
	rm -f $(TARGET) $(BISON_OUT) $(BISON_HEADER) $(FLEX_OUT)

run: $(TARGET)
	./$(TARGET)
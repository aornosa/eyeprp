CC = gcc
BISON = bison
FLEX = flex

CFLAGS = -Wall
LDFLAGS = -lfl

BUILD_DIR = build
TARGET = $(BUILD_DIR)/eyeprp

INCLUDES = -I. -I$(BUILD_DIR)

SRC_BISON = parser.y
SRC_FLEX = lexer.l
SRC_C = main.c prescription.c

BISON_OUT = $(BUILD_DIR)/parser.tab.c
BISON_HEADER = $(BUILD_DIR)/parser.tab.h
FLEX_OUT = $(BUILD_DIR)/lex.yy.c

OBJ = $(BISON_OUT:.c=.o) $(FLEX_OUT:.c=.o) $(BUILD_DIR)/main.o $(BUILD_DIR)/prescription.o

all: $(TARGET)

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(TARGET): $(OBJ)
	$(CC) $(CFLAGS) $(INCLUDES) $^ -o $@ $(LDFLAGS)

$(BUILD_DIR)/%.o: $(BUILD_DIR)/%.c | $(BUILD_DIR)
	$(CC) $(CFLAGS) $(INCLUDES) -c $< -o $@

$(BUILD_DIR)/main.o: main.c | $(BUILD_DIR)
	$(CC) $(CFLAGS) $(INCLUDES) -c $< -o $@

$(BUILD_DIR)/prescription.o: prescription.c | $(BUILD_DIR)
	$(CC) $(CFLAGS) $(INCLUDES) -c $< -o $@

$(BISON_OUT) $(BISON_HEADER): $(SRC_BISON) | $(BUILD_DIR)
	$(BISON) -d -o $(BISON_OUT) --defines=$(BISON_HEADER) $(SRC_BISON)

$(FLEX_OUT): $(SRC_FLEX) $(BISON_HEADER) | $(BUILD_DIR)
	$(FLEX) -o $(FLEX_OUT) $(SRC_FLEX)

clean:
	rm -rf $(BUILD_DIR) prescription.json

run: $(TARGET)
	./$(TARGET) examples/presc1.txt

.PHONY: all clean run
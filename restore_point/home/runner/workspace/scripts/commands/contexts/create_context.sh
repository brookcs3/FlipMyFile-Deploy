#!/bin/bash
# Script to create a context file

if [ $# -lt 2 ]; then
  echo "Usage: $0 [topic_name] [context_details]"
  exit 1
fi

TOPIC=$1
DETAILS="${@:2}"
FILENAME="context_${TOPIC// /_}.md"
FILEPATH="scripts/commands/contexts/$FILENAME"

echo "# Context: $TOPIC" > "$FILEPATH"
echo "" >> "$FILEPATH"
echo "Created: $(date)" >> "$FILEPATH"
echo "" >> "$FILEPATH"
echo "## Details" >> "$FILEPATH"
echo "" >> "$FILEPATH"
echo "$DETAILS" >> "$FILEPATH"
echo "" >> "$FILEPATH"

echo "Context file created at: $FILEPATH"

#!/bin/bash
# Command file for memory management instructions

echo "==== MEMORY MANAGEMENT COMMANDS ===="
echo ""
echo "1. To update AI_GUIDE.md with latest conversation:"
echo "   Say: \"Please update the AI_GUIDE.md with our latest discussion\""
echo ""
echo "2. To create a summary of the current conversation state:"
echo "   Say: \"Generate a conversation summary and save it to docs/summaries/[date].md\""
echo ""
echo "3. To remind the AI agent of a specific topic:"
echo "   Say: \"Please review [specific document] and follow those instructions\""
echo ""
echo "4. To save important context for later reference:"
echo "   Say: \"Please create a context file for [topic] with these details: [details]\""
echo ""
echo "==== END OF MEMORY MANAGEMENT COMMANDS ===="

mkdir -p docs/summaries

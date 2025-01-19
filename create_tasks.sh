#!/bin/bash

# Path ke direktori 'submissions/YourName'
BASE_DIR="Arweave-Academy/submissions/YourName"

# Membuat folder untuk Task 2 hingga Task 10
for i in {2..10}
do
    # Membuat folder task2, task3, ..., task10
    mkdir -p "$BASE_DIR/task$i"

    # Menambahkan file README.md di setiap folder task
    touch "$BASE_DIR/task$i/README.md"

    # Isi file README.md dengan template atau instruksi
    echo "# Task $i" > "$BASE_DIR/task$i/README.md"
    echo "This is the documentation for Task $i" >> "$BASE_DIR/task$i/README.md"

    echo "Task $i folder created with README.md"
done

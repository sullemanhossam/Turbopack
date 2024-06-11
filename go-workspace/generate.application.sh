#!/bin/bash

echo "Enter the name for the application: "
read applicationName

gen_lib_command="nx g @nx-go/nx-go:application data-access --name=$applicationName --directory=apps --projectNameAndRootFormat=derived --tags=database,data --skipFormat=false"

echo "Executing command: $gen_lib_command"

# Execute the command
$gen_lib_command

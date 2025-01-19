#!/bin/bash
startdirectory="./"
searchterm="dangerouslySetInnerHTML"

i=0; 

  for file in $(grep -R --exclude={dangerouslySetInnerHTML.sh,sast.yml} --exclude-dir=.git -l $searchterm $startdirectory)
    do
      echo $file

    let i++;

      echo "::warning::dangerouslySetInnerHTML found in: " $file

  done
  
echo " *** All Done! *** Total files with dangerouslySetInnerHTML found:" $i

if [ $i != 0 ]; then
  exit 1
fi
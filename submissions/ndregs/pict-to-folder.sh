for file in *.png; do
  folder="${file%.*}"  
  mkdir -p "../$folder"  
  mv "$file" "../$folder/"  
done

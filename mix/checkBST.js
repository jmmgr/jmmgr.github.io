function isBST(root, node_min, node_max) 
{ 
    if (!root) 
        return true; 
  
    if (node_min && root.data < node_min.data) 
        return false; 
  
    if (node_max && root.data > node_max.data) 
        return false; 
  
    return isBST(root.left, node_min, root) && 
           isBST(root.right, root, node_max); 
} 

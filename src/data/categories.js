// Stable category IDs; labels may change without migrating saved products.
export const CATEGORIES=[
{id:'electronics',label:'Electronics'},
{id:'computers',label:'Computers & tablets'},
{id:'home',label:'Home & kitchen'},
{id:'appliances',label:'Appliances'},
{id:'fashion',label:'Fashion & accessories'},
{id:'beauty',label:'Beauty & personal care'},
{id:'health',label:'Health & fitness'},
{id:'baby',label:'Baby & kids'},
{id:'toys',label:'Toys & games'},
{id:'sports',label:'Sports & outdoors'},
{id:'automotive',label:'Automotive'},
{id:'books',label:'Books & media'},
{id:'pets',label:'Pet supplies'},
{id:'other',label:'Other'}
];
export const categoryLabel=id=>CATEGORIES.find(category=>category.id===id)?.label||'Uncategorized';
export const categoryOptions=[{id:'all',label:'All categories'},...CATEGORIES];

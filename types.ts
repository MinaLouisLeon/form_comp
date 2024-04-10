type categoryType = {
    id:number;
    name:string;
    description: string | null;
    image: string;
    slug:string;
    children: subCategoryType[]
}

type subCategoryType = {
    id:number;
    name:string;
    description:string | null;
    slug:string;
    children: null;
    circle_icon:string;
    disable_shipping: number | boolean;
}

type propertiesType = {
    id:number;
    name:string;
    description:string | null;
    slug:string;
    options:optionsType[];
}

type optionsType = {
    child: boolean;
    id: number;
    name: string;
    parent: number;
    slug:string;
}

export type {categoryType, subCategoryType,propertiesType}
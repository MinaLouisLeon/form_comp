"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField } from "./ui/form";
import { Button } from "./ui/button";
import SelectionFormField from "./SelectionFormField";
import { useState, useEffect } from "react";
import { categoryType, propertiesType, subCategoryType } from "@/types";
import { Input } from "./ui/input";
import SubmitTable from "./SubmitTable";
import { getData } from "@/lib/getData";
let FormSchema = z.object({
    category: z.object({
        id: z.number(),
        name: z.string()
    }),
    subCategory: z.object({
        id: z.number(),
        name: z.string()
    })
})

const FormComp = () => {
    const [switchToResult, setSwitchToResult] = useState(false)
    const [allCategory, setAllCategory] = useState<categoryType[]>([]);
    const [allSubCategory, setAllSubCategory] = useState<subCategoryType[]>([]);
    const [properties, setProperties] = useState<propertiesType[]>([]);
    const [formSchemaState, setFormSchemaState] = useState<any>(FormSchema);
    const [mapState, setMapState] = useState<{ id: number | null, name: string, input?: string }[]>([]);
    const [formData, setFormData] = useState<any>();
    
    const getAllCategory = async () => {
        let data = await getData("https://staging.mazaady.com/api/v1/get_all_cats");
        setAllCategory(data.data.categories)
    }
    const getProperties = async (id: number) => {
        const data = await getData(`https://staging.mazaady.com/api/v1/properties?cat=${id}`);
        const newSchemaArr = data.data.map((item: propertiesType) => {
            return item.name
        })
        const mapStateInit = Array(data.data.length).fill({ id: null, name: "", input: "" })
        updateSchema(newSchemaArr);
        setMapState(mapStateInit);
        setProperties(data.data);
    }
    const getAllOptions = async (id: number, index: number) => {
        const data = await getData(`https://staging.mazaady.com/api/v1/get-options-child/${id}`);
        const newSchemaArr = data.data.map((item: propertiesType) => {
            return item.name
        })
        updateSchema(newSchemaArr);
        const arr1 = properties.slice(0, index + 1);
        const arr2 = properties.slice(index + 1, properties.length);
        const newData = [...arr1, ...data.data, ...arr2];
        const mapArr1 = mapState.slice(0, index + 1);
        const mapArr2 = Array(data.data.length).fill({ id: null, name: "", input: "" });
        const mapArr3 = mapState.slice(index + 1, mapState.length);
        const newMapArr = [...mapArr1, ...mapArr2, ...mapArr3];
        setProperties(newData);
        setMapState(newMapArr);
    }
    useEffect(() => {
        getAllCategory();
    }, [])

    const updateSchema = async (newSchemaArr: string[]) => {
        newSchemaArr.forEach((item) => {
            // @ts-ignore
            FormSchema = FormSchema.extend({
                [item]: z.object({
                    id: z.number(),
                    name: z.string(),
                    input: z.string().optional(),
                }).optional()
            });
        })
        setFormSchemaState(FormSchema);
    }
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(formSchemaState)
    })
    const onFormSubmit = (data: z.infer<typeof FormSchema>) => {
        setFormData(data);
        setSwitchToResult(true);
    }
    const mapSelectionField = (optionsArray: propertiesType[]) => {
        return optionsArray.map((item, index) => {
            return (
                <div key={item.name}>
                    <FormField
                        control={form.control}
                        //@ts-ignore
                        name={item.name}
                        render={({ field }) => (
                            <SelectionFormField
                                label={item.name}
                                placeholder={item.name}
                                optionsArray={[...item.options, { id: 0.1, name: "Other" }]}
                                //@ts-ignore
                                selectedValue={field.value?.id}
                                onSelect={(value, name) => {
                                    //@ts-ignore
                                    form.setValue(item.name, { id: value, name: name })
                                    let newMapState = mapState.map((item, index2) => {
                                        if (index === index2) {
                                            return { id: value, name: name, input: "" }
                                        } else {
                                            return item
                                        }
                                    })
                                    setMapState(newMapState);
                                }}
                                getItem={(item) => {
                                    if (item.child) {
                                        getAllOptions(item.id, index)
                                    }
                                }}
                            />
                        )}
                    />
                    {mapState[index]?.id === 0.1 ?
                        <>
                            <Input className="w-[500px] m-2" placeholder="user input" value={mapState[index]?.input} onChange={(e) => setMapState(mapState.map((item, index2) => index === index2 ? { ...item, input: e.target.value } : item))} required />
                        </>
                        : null}
                </div>
            )
        })
    }
    return (
        <>
            {switchToResult ?
                <SubmitTable formData={formData} mapData={mapState} />
                :
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onFormSubmit)}>
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <SelectionFormField
                                    label="Category"
                                    selectedValue={field.value?.id}
                                    placeholder="Category"
                                    optionsArray={allCategory}
                                    onSelect={(value, name) => {
                                        form.setValue("category", { id: value, name: name });
                                    }}
                                    getItem={(item) => setAllSubCategory(item.children)}
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subCategory"
                            render={({ field }) => (
                                <SelectionFormField
                                    label="Sub Category"
                                    placeholder="sub category"
                                    optionsArray={allSubCategory}
                                    selectedValue={field.value?.id}
                                    onSelect={(value, name) => {
                                        form.setValue("subCategory", { id: value, name: name })
                                        getProperties(value);
                                    }}
                                />
                            )}
                        />
                        {properties.length > 0 && mapSelectionField(properties)}
                        <Button type="submit" className="mt-2">Submit</Button>
                    </form>
                </Form>
            }
        </>
    )
}

export default FormComp;
import '@testing-library/jest-dom'
import { render, screen} from '@testing-library/react';
import FormComp from '@/components/FormComp';
import userEvent from '@testing-library/user-event'
import { categoryData, propertiesData } from './contants';

describe('test select popover' ,() => {
    it('shoud render buttons and popover and sub category to be disabled',async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(categoryData)
            })
        )
        render(<FormComp />)  
        const categoryButton = screen.getByText('Select Category');
        expect(categoryButton).toBeInTheDocument();
        const subCategory = screen.getByText('Select sub category');
        expect(subCategory).toBeInTheDocument();
        expect(subCategory).toBeDisabled();
        userEvent.click(categoryButton);
        const categoryDialog = await screen.findByRole('dialog');
        expect(categoryDialog).toBeInTheDocument();
    })
    it('should enable subcategory button when category is selected',async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(categoryData)
            })
        )
        render(<FormComp />)
        const categoryButton = screen.getByText('Select Category');
        userEvent.click(categoryButton);
        const button = await screen.findByText('CARS , MOTORCYCLES & ACCESSORIES');
        await userEvent.click(button);
        const subCategory = await screen.getByText('Select sub category');
        expect(subCategory).toBeEnabled();
    })
    it('after sub category selected test submit and render the result table',async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(categoryData)
            })
        )
        render(<FormComp />)
        const categoryButton = screen.getByText('Select Category');
        userEvent.click(categoryButton);
        const button = await screen.findByText('CARS , MOTORCYCLES & ACCESSORIES');
        await userEvent.click(button);
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(propertiesData)
            })
        )
        const subCategory = await screen.getByText('Select sub category');
        await userEvent.click(subCategory);
        const button2 = await screen.findByText('Cars');
        await userEvent.click(button2);
        const submit = screen.getByRole('button',{name:'Submit'});
        await userEvent.click(submit);
        const table = await screen.findByRole('table');
        expect(table).toBeInTheDocument();
    })
})


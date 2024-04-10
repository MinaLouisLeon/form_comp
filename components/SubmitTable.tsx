
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

const SubmitTable = ({formData,mapData}:{formData:any,mapData:any}) => {
  return (
    <Table className='w-[700px] text-center border'>
        <TableHeader className='bg-gray-100'>
            <TableRow>
                <TableHead className='text-center font-bold'>Field</TableHead>
                <TableHead className='text-center font-bold'>Value</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
           {Object.keys(formData).map((key,index)=>{
             return(
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                {formData[key] === undefined ? "not selected" : (
                  formData[key].id === 0.1 ? 
                    mapData[index].input
                  : formData[key].name
                )}
              </TableRow>
             )
           })}
        </TableBody>
    </Table>
  )
}

export default SubmitTable
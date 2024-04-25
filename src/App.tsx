import { useEffect, useState } from 'react';
import { ComboBox } from './components/ui/combobox';
import * as d3 from 'd3';
import tips from './tips.csv'

function App() {
  const [numerical_cols, setNumCols] = useState<d3.DSVParsedArray<{
    tip: number;
    total_bill: number;
    size: number;
  }> | null>(null);
  const [catagorical_cols, setCatCols] = useState<d3.DSVParsedArray<{
    sex: string,
    smoker: string,
    day: string,
    time: string,
  }> | null>(null);
  let numerical_labels = null;

  useEffect(() => { 
    const getNumericalData = async () => {
      await d3
        .csv(tips, (d: { tip: string; total_bill: string; size: string; }) => { 
          return {
            tip: parseFloat(d.tip),
            total_bill: parseFloat(d.total_bill),
            size: parseInt(d.size)
          }
        })
        .then((data) => {
          setNumCols(data);
        })
        .catch((err: any) => {
          console.error(err);
        });
    };

    const getCatagoricalData = async () => {
      await d3
        .csv(
          tips,
          (d: { sex: string; smoker: string; day: string; time: string }) => {
            return {
              sex: d.sex,
              smoker: d.smoker,
              day: d.day,
              time: d.time,
            };
          }
        )
        .then((data) => {
          setCatCols(data);
        })
        .catch((err: any) => {
          console.error(err);
        });
    };
    
    getNumericalData();
    getCatagoricalData();
  },[])

  if (numerical_cols !== null) {
    numerical_labels = Object.keys(numerical_cols[0]).map((catagory) => {
      return {
        value: catagory,
        label: (catagory[0].toUpperCase() + catagory.slice(1)).replace(
          '_',
          ' '
        ),
      };
    });
  }

  return (
    <div className="flex w-full">
      <div className="flex justify-center w-full">
        <ComboBox
          items={numerical_labels !== null ? numerical_labels : [{label: '', value: ''}]}
          placeholder="Select Column"
          className="text-black"
        />
      </div>
    </div>
  );
}

export default App;

import tips from './tips.csv';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import { ComboBox } from './components/ui/combobox';
import { BarChart } from './components/ui/barchart';
import { CorrelationMap } from './components/ui/correlation_map';
import { ScatterPlot } from './components/ui/scatterplot';

function App() {
  const [numerical_cols, setNumCols] = useState<d3.DSVParsedArray<{
    tip: number;
    total_bill: number;
    size: number;
  }> | null>(null);
  const [catagorical_cols, setCatCols] = useState<d3.DSVParsedArray<{
    sex: string;
    smoker: string;
    day: string;
    time: string;
  }> | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(
    'total_bill'
  );
  const [selectedPair, setSelectedPair] = useState(null);
  let numerical_labels = null;

  useEffect(() => {
    const getNumericalData = async () => {
      await d3
        .csv(tips, (d: { tip: string; total_bill: string; size: string }) => {
          return {
            tip: parseFloat(d.tip),
            total_bill: parseFloat(d.total_bill),
            size: parseInt(d.size),
          };
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
  }, []);

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
    <div className="flex flex-col w-full h-full justify-center">
      <div className="bg-[#EDEDED] w-full">
        <div className="flex text-center items-center justify-center space-x-4">
          <p className="">Select Target: </p>
          <ComboBox
            items={
              numerical_labels !== null
                ? numerical_labels
                : [{ label: '', value: '' }]
            }
            placeholder="Select Column"
            className="mb-4 mt-4 "
            containerClassName="flex justify-center"
            onValueChange={setSelectedValue}
          />
        </div>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex w-fit flex-col p-4">
          <div className="flex w-full pt-4 space-x-4 justify-center">
            <div className="flex ml-0 border border-zinc-200 p-16 rounded-md">
              <BarChart
                numerical_data={numerical_cols}
                categorical_data={catagorical_cols}
                selectedValue={selectedValue}
                className="flex flex-col"
              />
            </div>
            <div className="flex justify-center w-fit p-4 border border-zinc-200 rounded-md">
              <CorrelationMap
                numerical_cols={numerical_cols}
                setSelectedPair={setSelectedPair}
              />
            </div>
          </div>
          <div className="flex justify-center mb-20">
            <div className="mt-8 justify-center w-fit p-4 border border-zinc-200 rounded-md">
              {selectedPair !== null ? (
                <ScatterPlot
                  numerical_cols={numerical_cols}
                  selectedPair={selectedPair}
                />
              ) : (
                'Select an element from the Correlation Matrix to display Scatter Plot'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

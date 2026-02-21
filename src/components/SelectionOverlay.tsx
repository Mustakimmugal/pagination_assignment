import React, { useState, useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import type { InputNumberValueChangeEvent } from "primereact/inputnumber";

interface Props {
  onSelect: (value: number) => void;
}

export const SelectionOverlay: React.FC<Props> = ({ onSelect }) => {
  const panelRef = useRef<OverlayPanel>(null);
  const [value, setValue] = useState<number | null>(null);

  const handleSubmit = () => {
    if (value !== null && value > 0) {
      onSelect(value);
      panelRef.current?.hide(); //handle submit and hide the overlay
      setValue(null);
    }
  };

  return (
    <>
      {/* // opren the overlay */}
      <Button
        type="button"
        icon="pi pi-chevron-down"
        className="p-button-text p-button-sm selection_chevron_btn"
        onClick={(e) => panelRef.current?.toggle(e)}
      />

      <OverlayPanel ref={panelRef} dismissable className="cus_sel_overlay" style={{ width: "260px" }}>
        <div className="sel-panel-con">
        <div style={{ padding: "10px" }}>
          <h4 className="sel-pan-title">Select Multiple Rows</h4>
          <p className="sel-pan-description">
            Enter number of rows to select
          </p>
          <div className="sel_input_wrapper">
            <InputNumber className="sel-panel-input"
              value={value}
              onValueChange={(e: InputNumberValueChangeEvent) =>
                setValue(e.value ?? null)
              }
              placeholder="e.g. 20"
              min={1}
            />
          </div>
          <div className="sel_btn_container">
            <Button className="sel-sub-btn"
              label="Select"
              size="small"
              onClick={handleSubmit}
            />

          </div>
        </div>
        </div>
      </OverlayPanel>
    </>
  );
};
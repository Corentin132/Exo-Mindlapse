type Props = {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
};

const Checkbox = ({ checked, onChange, label }: Props) => {
  return (
    <div>
      <p>{label}</p>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </div>
  );
};
export default Checkbox;

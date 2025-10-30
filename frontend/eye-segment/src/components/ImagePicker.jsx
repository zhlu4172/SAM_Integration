export default function ImagePicker({ onChange }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <input type="file" accept="image/*" onChange={onChange} />
    </div>
  );
}



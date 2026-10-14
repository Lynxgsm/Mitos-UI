export type PropRow = { prop: string; type: string; default?: string; description: string };

export function PropsTable(props: { component: string; rows: PropRow[] }) {
  return (
    <div className="props-table-wrapper">
      <table className="props-table">
        <caption className="visually-hidden">{props.component} props</caption>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row) => (
            <tr key={row.prop}>
              <th scope="row">
                <code>{row.prop}</code>
              </th>
              <td>
                <code>{row.type}</code>
              </td>
              <td>{row.default ? <code>{row.default}</code> : "—"}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

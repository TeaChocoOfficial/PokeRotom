export default function TypeComponent({ type }: { type: string }) {
    return <span className={`type-component ${type}`}>{type}</span>;
}

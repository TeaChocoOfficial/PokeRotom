//-Path: "TeaChoco-Hospital/client/src/components/custom/Activity.tsx"
import { Activity as ReactActivity } from 'react';

export default function Activity({
    visible,
    children,
}: {
    children: React.ReactNode;
    visible?: boolean | string | null | object;
}) {
    return <ReactActivity mode={Boolean(visible) ? 'visible' : 'hidden'}>{children}</ReactActivity>;
}

import type { Instrument } from './types';
import { InstrumentRow } from './InstrumentRow';
import styles from './MusicDiagram.module.css';

interface GroupSectionProps {
  label: string;
  instruments: Instrument[];
  sections: string[];
  activeSection: number;
  onSectionChange: (index: number) => void;
  isFirst?: boolean;
}

export function GroupSection({ label, instruments, sections, activeSection, onSectionChange, isFirst }: Readonly<GroupSectionProps>) {
  return (
    <>
      <div className={styles.grpLabel} style={isFirst ? { borderTop: 'none' } : undefined}>— {label}</div>
      {instruments.map(inst => (
        <InstrumentRow
          key={inst.id}
          instrument={inst}
          sections={sections}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
      ))}
    </>
  );
}

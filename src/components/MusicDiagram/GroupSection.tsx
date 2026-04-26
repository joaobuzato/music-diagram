import type { InstrumentGroup } from './types';
import { InstrumentRow } from './InstrumentRow';
import { VocalCurveRow } from './VocalCurveRow';
import styles from './MusicDiagram.module.css';

interface GroupSectionProps {
  group: InstrumentGroup;
  sections: string[];
  activeSection: number;
  onSectionChange: (index: number) => void;
  isFirst?: boolean;
}

export function GroupSection({ group, sections, activeSection, onSectionChange, isFirst }: Readonly<GroupSectionProps>) {
  return (
    <>
      <div className={styles.grpLabel} style={isFirst ? { borderTop: 'none' } : undefined}>— {group.label}</div>
      {group.instruments.map(inst =>
        inst.isVocal ? (
          <VocalCurveRow
            key={inst.id}
            instrument={inst}
            sections={sections}
            activeSection={activeSection}
          />
        ) : (
          <InstrumentRow
            key={inst.id}
            instrument={inst}
            sections={sections}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />
        )
      )}
    </>
  );
}

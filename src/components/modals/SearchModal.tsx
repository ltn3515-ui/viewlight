import React, { useState } from 'react';
import styled from 'styled-components';
import { useModal } from '../../context/ModalContext';
import { useToast } from '../../context/ToastContext';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 99999;
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;
`;

const ModalCard = styled.div`
  width: 90%;
  max-width: 500px;
  background: #181C26;
  color: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

const SearchInputGroup = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  input {
    flex: 1;
    padding: 12px 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #FFFFFF;
    font-size: 0.95rem;

    &:focus { border-color: #FFAB40; outline: none; }
  }

  button {
    padding: 12px 20px;
    border-radius: 12px;
    background: #FFAB40;
    color: #121826;
    font-weight: 800;
  }
`;

const TagTitle = styled.h4`
  font-size: 0.85rem;
  color: #94A3B8;
  margin-bottom: 10px;
`;

const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  span {
    padding: 6px 12px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.82rem;
    color: #F4F1EA;
    cursor: pointer;

    &:hover { border-color: #FFAB40; color: #FFAB40; }
  }
`;

export const SearchModal: React.FC = () => {
  const { activeModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');

  if (activeModal !== 'search') return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    showToast(`🔍 [${query}] 검색 결과를 찾기 위해 무드등 목록으로 이동합니다.`);
    closeModal();
  };

  return (
    <Overlay $isOpen={true} onClick={closeModal}>
      <ModalCard onClick={e => e.stopPropagation()}>
        <SearchInputGroup onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="어떤 공간 조명을 찾으시나요?"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit">검색</button>
        </SearchInputGroup>

        <TagTitle>인기 추천 검색어</TagTitle>
        <TagGroup>
          {['원목 탁상등', '아우라 플로어', '스마트 스트립', '침실 무드등', 'RGB 조도 조절'].map(tag => (
            <span key={tag} onClick={() => { setQuery(tag); showToast(`🔍 [${tag}] 검색 결과를 조회합니다.`); closeModal(); }}>
              #{tag}
            </span>
          ))}
        </TagGroup>
      </ModalCard>
    </Overlay>
  );
};

import {
    PrizesStyled,
    PrizeMegaStyled,
    PrizeMiniStyled,
    PrizeAmountStyled
} from "./Prizes.styled";

interface Props {
    megaPrize: string;
    miniPrize: string;
}

export default function Prizes({ megaPrize, miniPrize }: Props): JSX.Element {
    return (
        <PrizesStyled>
            <PrizeMegaStyled>
                <div>
                    <img src="/assets/jackpot.png" width="240" height="105" />
                </div>
                <div>
                    <span>{megaPrize}</span>
                    {/* <PrizeAmountStyled color="#FFF700">{formatDecimals(megaPrize)}</PrizeAmountStyled> */}
                </div>
            </PrizeMegaStyled>
            <PrizeMiniStyled>
                <div>
                    <img src="/assets/mini.png" width="160" height="92" />
                </div>
                <div>
                    <PrizeAmountStyled>{miniPrize}</PrizeAmountStyled>
                </div>
            </PrizeMiniStyled>
        </ PrizesStyled>
    );
}

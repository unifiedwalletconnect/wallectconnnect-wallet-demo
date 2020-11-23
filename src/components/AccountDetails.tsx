import * as React from "react";
import styled from "styled-components";
import Dropdown from "../components/Dropdown";
import { ellipseAddress, getViewportDimensions, getNetworkData } from "../helpers/utilities";
import { responsive } from "../styles";
import Blockie from "./Blockie";

const SSection = styled.div`
  width: 100%;
`;

const SBlockie = styled(Blockie)`
  margin-right: 5px;
  @media screen and (${responsive.xs.max}) {
    margin-right: 1vw;
  }
`;

const SAddressDropdownWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface IAccountDetailsProps {
  chain: string;
  networks: string[];
  network: string;
  accounts: string[];
  account: string;
  updateNetwork?: any;
  updateAccount?: any;
}

const AccountDetails = (props: IAccountDetailsProps) => {
  const { chain, networks, network, accounts, account, updateNetwork, updateAccount } = props;
  const windowWidth = getViewportDimensions().x;
  const maxWidth = 468;
  const maxChar = 12;
  const ellipseLength =
    windowWidth > maxWidth ? maxChar : Math.floor(windowWidth * (maxChar / maxWidth));
  const accountsMap = accounts.map((addr: string) => ({
    address: addr,
    display_address: ellipseAddress(addr, ellipseLength),
  }));
  const networksMap = networks.map(network => getNetworkData(chain, network));
  return (
    <React.Fragment>
      <SSection>
        <h6>{"Account"}</h6>
        <SAddressDropdownWrapper>
          <SBlockie size={40} account={account} />
          <Dropdown
            monospace
            selected={account}
            options={accountsMap}
            displayKey={"display_address"}
            targetKey={"address"}
            onChange={updateAccount}
          />
        </SAddressDropdownWrapper>
      </SSection>
      <SSection>
        <h6>{"Network"}</h6>
        <Dropdown
          selected={network}
          options={networksMap}
          displayKey={"name"}
          targetKey={"network"}
          onChange={updateNetwork}
        />
      </SSection>
    </React.Fragment>
  );
};
export default AccountDetails;
